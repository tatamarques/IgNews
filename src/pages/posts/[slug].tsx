import { GetServerSideProps } from "next"
import Head from "next/head"
import { getSession } from "next-auth/client"

import React from "react"

import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../services/prismic"

import styles from './post.module.scss';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Post({ post } : PostProps){
  return(
    <>
      <Head>
        <title>{post.title} | Ignews </title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent} 
            dangerouslySetInnerHTML={{__html: post.content}}/>  
        </article>  
      </main> 
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({req: context.req})
  const {slug} = context.query;
  
  if (!session?.activeSubscription) {
    return{
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(context.req);

  const response = await prismic.getByUID('post', String(slug), {});


  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR',{
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
  }
  return{
    props:{
      post,
    }
  }
}