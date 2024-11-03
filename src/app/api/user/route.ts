import {getPortfolioDataService} from "@/service/interlay/PortfolioDataServiceFactory";
import {NextRequest, NextResponse} from "next/server";

const portfolioDataService = getPortfolioDataService();

export async function GET(req: NextRequest) {

    const portfolio: Portfolio = portfolioDataService.getPortfolio();
    const field = req.nextUrl.searchParams.get('field');
    if(field === 'name') {
        return new NextResponse(JSON.stringify({name: portfolio.name}), {status: 200});
    }
    if(field === 'lastName') {
        return new NextResponse(JSON.stringify({lastName: portfolio.lastName}), {status: 200});
    }
    // return 404
    return new NextResponse(JSON.stringify({error: 'Field not found'}), {status: 404});

}