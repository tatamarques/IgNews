import Prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown){
  const prismic = Prismic.client(
    process.env.PRISMIC_ENDPOINT,
    {
      req,
      accessToken: process.env.NEXT_PUBLIC_PRIMISC_ACCESS_TOKEN
    }
  )

  return prismic;
}