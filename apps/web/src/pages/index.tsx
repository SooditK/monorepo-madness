import { api } from "@/utils/api";

export default function Home() {
  const hello = api.example.exampleApi.useQuery();

  return (
    <>
      <div>hello world</div>
      {hello.data && <div>{hello.data.message}</div>}
    </>
  );
}
