import { cn } from "@/lib/utils";

type Type = 'notFound' | 'noResume' | 'noJob' | 'noCompany' | "noApplications" | "noOffers";

interface Props {
    type: Type
    className?: string
}

export const NothingFound = ({ type, className } : Props) => {
    const messages = {
        'notFound': "На жаль за вашим запитом нічого не було знайдено. ",
        'noResume': "На жаль такого резюме не існує. ",
        'noJob': "На жаль такої вакансії не існує. ",
        'noCompany': "На жаль такої компанії не існує. ",
        'noApplications': "На жаль у вас немає відгуків. ",
        'noOffers': "На жаль у вас немає пропозицій. ",
    };
  
    return (
        <div className={cn("my-auto mt-48", className)}>
            <h1 className="text-title-bg max-w-96 text-center mx-auto">
            Отакої! Нічого не знайдено
            </h1>

            <div className="text-center text-common-dark mx-auto max-w-96 flex flex-col">
            <span className="text-title-bg mb-2">
                (๑◕︵◕๑)
            </span>
            {messages[type]}
            Будь-ласка перевірте запит.
            </div>
        </div>
    );

  };
  