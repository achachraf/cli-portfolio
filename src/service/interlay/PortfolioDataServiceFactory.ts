import {FilePortfolioDataService} from "@/service/interlay/FilePortfolioDataService";
import {HttpPortfolioDataService} from "@/service/interlay/HttpPortfolioDataService";


const portfolioDataPath = process.env.PORTFOLIO_DATA_PATH || '/opt/cli-portfolio/portfolio.json';
const httpPortfolioService = new HttpPortfolioDataService(portfolioDataPath);
const filePortfolioService = new FilePortfolioDataService(portfolioDataPath);

export const getPortfolioDataService = () => {
    if(portfolioDataPath.startsWith('http')) {
        return httpPortfolioService
    }
    return filePortfolioService;
}