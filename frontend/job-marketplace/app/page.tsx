"use client";
import { Container } from "@/components/Container";
import { SearchInput } from "@/components/shared";
import { StackSection } from "@/components/shared/stackSection";
import { Button } from "@/components/ui/button";
import { SmallBannerSection } from "@/components/ui/small-banner-section";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  
  const handleSearch = async (query: string) => {
    if(query.trim() === "") router.push(`/jobs`);
    if( query.length < 2) return;
    router.push(`/jobs?search=${query}`);
}

  return (
    <>
      <div className="mb-48 bg-[#1C64EE] w-full">
          <div className="px-4">
            <Container className="py-24">
              <div className="flex justify-between content-center md:gap-12 max-md:flex-col-reverse">
                <div className="content-center mx-auto text-center">
                  <h1 className="text-5xl font-bold mb-4 text-white max-w-2xl">Знайди свою омріяну роботу разом з нами</h1>
                  <p className="text-xl text-white">Анонімно, швидко та безкоштовно</p>
                  <div className="max-md:flex-col flex items-center gap-4 mt-8">
                    <SearchInput className="w-full" onSearch={handleSearch} />
                    <Button className="flex items-center gap-2 max-md:w-full" variant={'outline_2'}>
                        <Link href={`/jobs`}>Знайти роботу</Link> 
                    </Button>
                  </div>
                </div>
              </div>
            </Container>
          </div>
      </div>
      <div className="mx-4 mb-48">
        <Container>
          <div className="text-center mb-48">
            <h1 className="text-5xl font-bold mb-12 max-lg:text-3xl">Що ми пропонуємо?</h1>
            <div className="flex justify-between max-md:grid max-md:grid-cols-2 max-md:justify-items-center max-sm:flex-col max-sm:flex max-sm:items-center max-sm:gap-4">
              <SmallBannerSection className="bg-[#EFEBFA] border-[#7A58CB]" IconName={"BriefcaseBusiness"} color="#7A58CB" title={"Пошук вакансій"} description={"Знаходьте актуальні вакансії від провідних компаній за декілька кліків."} />
              <SmallBannerSection className="bg-[#F5F8FF] border-[#1C64EE]" IconName={"UserSearch"} title={"Пошук кандидатів"} color="#1C64EE" description={"Знаходьте талановитих кандидатів для вашої команди за декілька кліків."} />
              <SmallBannerSection className="bg-[#FEF3EA] border-[#E7994B]" IconName={"FilePlus2"} title={"Створюйте оголошення"} color="#E7994B" description={"Створюйте оголошення про пошук вакансій швидкой та ефективно."} />
              <SmallBannerSection className="bg-[#EAF7DF] border-[#5A9B22]" IconName={"Wallet"} color='#5A9B22' title={"Ціна використання"} description={"Користуйтесь сервісом безкоштовно, без будь-якого внесення оплати за послуги."} />
            </div>
          </div>
          <StackSection className="mb-48" />
          {/* <div className="text-center">
            <h1 className="text-5xl font-bold mb-12 max-lg:text-4xl">Трохи статистики</h1>
            <div className="sm:flex gap-[10px] w-full grid-flow-col">
              <Image className="sm:max-w-[420px] mx-auto min-w-44 hover:-scale-[-1.02] transition-all max-sm:mb-4 max-sm:max-w-96" src="/images/banners/vacansies-published.png" alt="" />
              <Image className="sm:max-w-[420px] mx-auto min-w-44 hover:-scale-[-1.02] transition-all max-sm:mb-4 max-sm:max-w-96" src="/images/banners/companies-registrated.png" alt="" />
              <Image className="sm:max-w-[420px] mx-auto min-w-44 hover:-scale-[-1.02] transition-all max-sm:max-w-96" src="/images/banners/candidates-registrated.png" alt="" />
            </div>
          </div> */}
          {/* <div className="bg-[var(--blue-primary)] h-72 flex justify-between rounded-lg mb-3 overflow-hidden">
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl font-bold text-white">Шукаєте роботу?</h1>
              <p className="text-lg text-white">Хутчіш створювати профіль та резюме</p>
              <Button variant={'secondary'} onClick={() => console.log('Redirect to register')}>Створити профіль</Button>
            </div>
            <Image src="images/icons/Cube.png" alt="Memo" className="h-80 relative right-0 top pointer-events-none" />
          </div> */}
        <div className="mt-48">
          <Image src="/images/find-work.png" alt="find-work-img" width={512} height={512} className="md:w-1/2 m-auto"/>
        </div>
        </Container>
      </div>
    </>
  )
}
