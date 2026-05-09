import { XMLParser } from "fast-xml-parser";

export interface NFeProduct {
  code: string;
  name: string;
  ncm: string;
  unit: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  batch?: string;
  expiryDate?: string;
}

export interface NFeData {
  issuer: {
    name: string;
    cnpj: string;
  };
  products: NFeProduct[];
  totalValue: number;
  date: string;
  accessKey: string;
}

export async function parseNFeXML(xmlContent: string): Promise<NFeData> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  
  const jsonObj = parser.parse(xmlContent);
  const nfe = jsonObj.nfeProc?.NFe?.infNFe || jsonObj.NFe?.infNFe;
  
  if (!nfe) {
    throw new Error("XML de NF-e inválido ou não reconhecido.");
  }

  const emit = nfe.emit;
  const det = Array.isArray(nfe.det) ? nfe.det : [nfe.det];
  const total = nfe.total.ICMSTot;
  const ide = nfe.ide;

  const products: NFeProduct[] = det.map((item: any) => {
    // Tenta capturar lote e validade da tag rastro (traceabilidade)
    const rastro = item.prod.rastro;
    const firstRastro = Array.isArray(rastro) ? rastro[0] : rastro;
    
    return {
      code: item.prod.cProd,
      name: item.prod.xProd,
      ncm: item.prod.NCM,
      unit: item.prod.uCom,
      quantity: parseFloat(item.prod.qCom),
      unitValue: parseFloat(item.prod.vUnCom),
      totalValue: parseFloat(item.prod.vProd),
      batch: firstRastro?.nLote,
      expiryDate: firstRastro?.dVal,
    };
  });

  return {
    issuer: {
      name: emit.xNome,
      cnpj: emit.CNPJ,
    },
    products,
    totalValue: parseFloat(total.vNF),
    date: ide.dhEmi,
    accessKey: nfe.Id.replace("NFe", ""),
  };
}
