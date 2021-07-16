import { SiteClient } from "datocms-client";

export default async function getCommunities(request, response) {
  const client = new SiteClient(process.env.DATO_CMS_TOKEN);

  async function getRecords() {
    const record = await client.items.all({
      filter: {
        type: "972033",
      },
    });

    response.json({
      record: record,
    });
  }

  if (request.method === "POST") {
    return getRecords();
  }

  response.status(404).json({
    message: "Ainda não deu",
  });
}
