export const filtersList = (searchParams: URLSearchParams) => {
    return {
        page: searchParams.get('page') ?? '',
        category: searchParams.get('category') ?? '',
        subcategory: searchParams.get('subcategory') ?? '',
        experience: searchParams.get('experience') ?? '',
        city: searchParams.get('city') ?? '',
        employment: searchParams.get('employment') ?? '',
        salary_from: searchParams.get('salary_from') ?? ''
    }
}