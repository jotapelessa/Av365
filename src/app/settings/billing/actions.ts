'use server';

import { getProducerId, db } from "@/lib/tenant";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPortalSession() {
  const producerId = await getProducerId();
  if (!producerId) throw new Error("Não autenticado");

  const subscription = await db.subscription.findUnique({
    where: { producerId }
  });

  if (!subscription?.stripeCustomerId) {
    throw new Error("Cliente Stripe não encontrado. Realize uma assinatura primeiro.");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  return redirect(session.url);
}
