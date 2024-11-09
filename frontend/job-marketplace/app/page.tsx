import { Container } from "@/components/Container";
import { StackSection } from "@/components/shared/stackSection";
import { Button } from "@/components/ui/button";
import { SmallBannerSection } from "@/components/ui/small-banner-section";
import Link from "next/link";


export default function Home() {
  return (
    <>
      <div className="mb-48 bg-[#1C64EE] w-full">
          <div className="mx-2">
            <Container className="py-24">
              <div className="flex justify-between content-center">
                <div className="max-w-96 content-center">
                  <h1 className="text-5xl font-bold mb-4 text-white">Знайди свою омріяну роботу разом з нами</h1>
                  <p className="text-xl text-white">Анонімно, швидко та безпечно</p>
                  <div className="flex items-center gap-2 mt-8">
                    <Button asChild className="w-[160px]" variant={'outline_2'}>
                        <Link href="/jobs">Вакансії</Link>
                    </Button>
                    <Button asChild className="w-[160px]" variant={'outline'}>
                        <Link href="/candidates">Резюме</Link>
                    </Button>
                </div>
                </div>
                <img className="max-w-[600px] pointer-events-none" src="/images/logo/joobly-logo.svg" alt="" />
                </div>
            </Container>
          </div>
      </div>
      <div className="mx-2">
        <Container>
          <div className="text-center mb-48">
            <h1 className="text-5xl font-bold mb-12">Що ми пропонуємо?</h1>
            <div className="justify-between flex">
              <SmallBannerSection className="bg-[#EFEBFA] border-[#7A58CB]" IconName={"BriefcaseBusiness"} color="#7A58CB" title={"Пошук вакансій"} description={"Знаходьте актуальні вакансії від провідних компаній за декілька кліків."} />
              <SmallBannerSection className="bg-[#F5F8FF] border-[#1C64EE]" IconName={"UserSearch"} title={"Пошук кандидатів"} color="#1C64EE" description={"Знаходьте талановитих кандидатів для вашої команди за декілька кліків."} />
              <SmallBannerSection className="bg-[#FEF3EA] border-[#E7994B]" IconName={"FilePlus2"} title={"Створюйте оголошення"} color="#E7994B" description={"Створюйте оголошення про пошук кандидатів або вакансій швидкой та ефективно."} />
              <SmallBannerSection className="bg-[#EAF7DF] border-[#5A9B22]" IconName={"Wallet"} color='#5A9B22' title={"Безкоштовне використання"} description={"Користуйтесь сервісом безкоштовно, без внесення оплати."} />
            </div>
          </div>
          <StackSection className="mb-48" />
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-12">Трохи статистики</h1>
            <div className="flex gap-[10px] w-full">
              <img className="max-w-[420px] min-w-44 hover:-scale-[-1.02] transition-all" src="/images/banners/vacansies-published.png" alt="" />
              <img className="max-w-[420px] min-w-44 hover:-scale-[-1.02] transition-all" src="/images/banners/companies-registrated.png" alt="" />
              <img className="max-w-[420px] min-w-44 hover:-scale-[-1.02] transition-all" src="/images/banners/candidates-registrated.png" alt="" />
            </div>
          </div>
        <div className="mt-48">
          <img src="/images/find-work.png" alt="find-work-img" className="w-1/2 min-w-96 m-auto"/>
        </div>
        </Container>
      </div>
    </>
  )
}
