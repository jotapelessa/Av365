import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  const startTime = Date.now();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Signature failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    console.log(`⚡ Webhook received: ${event.type}`);

    // LOG DO EVENTO NO BANCO
    await db.webhookLog.create({
      data: {
        eventType: event.type,
        payload: event.data.object as any,
        status: "SUCCESS",
        latency: Date.now() - startTime
      }
    });

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.client_reference_id) {
          // Lógica para ativar assinatura
          await db.subscription.update({
            where: { producerId: session.client_reference_id },
            data: {
              stripeSubscriptionId: session.subscription as string,
              stripeCustomerId: session.customer as string,
              status: "ACTIVE"
            }
          });
        }
        break;

      case "customer.subscription.updated":
        const sub = event.data.object as any;
        await db.subscription.update({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: sub.status === "active" ? "ACTIVE" : "PAST_DUE",
            currentPeriodEnd: new Date(sub.current_period_end * 1000)
          }
        });
        break;

        break;

      case "customer.subscription.deleted":
        const deletedSub = event.data.object as Stripe.Subscription;
        await db.subscription.update({
          where: { stripeSubscriptionId: deletedSub.id },
          data: {
            status: "CANCELED"
          }
        });
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook processing failed:", error);
    
    // REGISTRA FALHA
    await db.webhookLog.create({
      data: {
        eventType: event.type,
        payload: event.data.object as any,
        status: "FAILED",
        error: error.message,
        latency: Date.now() - startTime
      }
    });

    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
