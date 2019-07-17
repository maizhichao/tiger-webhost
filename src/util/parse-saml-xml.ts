import { parseString } from "xml2js";

export type SamlInfo = {
  Id: String;
  Name: String;
  SPID: String;
  Email: String;
  Language: String;
};

export async function parseSamlXml(samlResponse: any): Promise<SamlInfo> {
  return new Promise((resolve, reject) => {
    const xml = new Buffer(samlResponse, "base64").toString("ascii");
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      }
      const assertion = result["saml2p:Response"]["saml2:Assertion"][0];
      const attributes =
        assertion["saml2:AttributeStatement"][0]["saml2:Attribute"];
      const attrs = attributes.reduce((obj: any, a: any) => {
        const name = a["$"]["Name"];
        const value = a["saml2:AttributeValue"][0]["_"];
        obj[name] = value;
        return obj;
      }, {});
      resolve(attrs);
    });
  });
}
