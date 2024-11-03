import {FilePortfolioDataService} from "@/service/interlay/FilePortfolioDataService";

export const getPortfolioDataService = () => {
    const portfolioDataPath = process.env.PORTFOLIO_DATA_PATH || '/opt/cli-portfolio/portfolio.json';
    return new FilePortfolioDataService(portfolioDataPath);
}