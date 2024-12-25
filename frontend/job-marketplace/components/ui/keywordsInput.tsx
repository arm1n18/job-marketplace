import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useOpenedRef } from "../hook/useOpenedRef";
import FetchDataService from "@/services/FetchDataService";
import { X } from "lucide-react";

interface Props {
    className?: string;
    keywords?: string[];
    disabled?: boolean;
    defaultValue?: string[];
    setKeywords: (keywords: string[]) => void
}

export const KeywordsInput: React.FC<Props> = ({className, keywords, disabled, defaultValue, setKeywords}) => {
    const openedRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [keywordsList, setKeywordsList] = useState<{ keywords: string[] } | null>(null);
    const [selectedKeywords, setSelectedKeywords] = useState<string[] | null>(keywords || null);
    useOpenedRef({isOpen: isOpen, setIsOpen: setIsOpen, openedRef});

    useEffect(() => {
        const getKeywords = new FetchDataService({url: `keywords/`, setLoading: () => {}, setData: setKeywordsList});
        getKeywords.getData();
    }, [])

    useEffect(() => {
        if (defaultValue) setSelectedKeywords(defaultValue);
    }, [defaultValue])

    const addKeyword = (keyword: string) => {
        if (selectedKeywords) {
            if (selectedKeywords.includes(keyword)) {
                setSelectedKeywords((prevKeywords) => prevKeywords && prevKeywords.filter(item => item !== keyword));
                setKeywords([...(keywords || [])].filter(item => item !== keyword))
            }
            else {
                setSelectedKeywords((prevKeywords) => prevKeywords && [...prevKeywords, keyword]);
                setKeywords([...(keywords || []), keyword])
            }
        }
    }

    return (
        <div className={cn(`bg-[#F9FAFB] w-full rounded-md border border-[#D0D5DD] px-3 py-2 flex flex-col ${disabled && 'cursor-not-allowed opacity-50'}`, className)}
            ref={openedRef}
            onClick={() => {
                if (!disabled) {
                  setIsOpen(true);
                  document.getElementById("keywords-field")?.focus();
                }
            }}
        >
           <div className="flex flex-wrap gap-2">
            {selectedKeywords && selectedKeywords.map((keyword, index) => <span key={index}
            className="key-word-block-bg flex gap-1">{keyword} <button className="rounded-full p-1 hover:bg-slate-400 hover:bg-opacity-30 size-4 my-auto"
            onClick={(e) => (e.stopPropagation(), addKeyword(keyword))}><X size={8}/></button></span>)}
            <input id="keywords-field" title="keywords" value={search} autoFocus={true} className="keywords-input max-w-24" onChange={(e) => setSearch(e.target.value)}/>
           </div>
           {
               isOpen && (
                <div className="mt-2 flex gap-2 flex-wrap">
                    {keywordsList?.keywords && keywordsList?.keywords.filter(keyword => keyword.toLowerCase().includes(search.toLowerCase()) && !selectedKeywords?.includes(keyword)).slice(0, 30).map((keyword, index) => (
                        keyword.toLowerCase().includes(search.toLowerCase()) && <span key={index} className="key-word-block-bg hover:cursor-pointer opacity-80" onClick={(e) => (e.stopPropagation(), addKeyword(keyword), setSearch(""))}>{keyword}</span>
                    ))}
                </div>
               )
           }
        </div>
    )
}