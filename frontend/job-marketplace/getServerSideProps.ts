import { parse } from 'cookie';
import { GetServerSideProps } from "next";

interface Props {
    authToken: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  console.log("Context:", context); // Логируем контекст
  const cookies = context.req.headers.cookie || '';
  const parsedCookies = parse(cookies);

  const authToken = parsedCookies.refresh_token || null;
  console.log("authToken:", authToken); // Логируем значение authToken

  return {
    props: { authToken }
  };
};
