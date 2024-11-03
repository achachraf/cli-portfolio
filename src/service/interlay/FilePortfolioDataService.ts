import PortfolioDataService from "@/service/application/PortfolioDataService";
import fs from 'fs';

export class FilePortfolioDataService implements PortfolioDataService {

    private readonly portfolioDataPath: string;

    private portfolio: Portfolio | undefined = undefined;

    constructor(portfolioDataPath: string) {
        this.portfolioDataPath = portfolioDataPath;
    }

    getPortfolio(): Portfolio {
        if(this.portfolio === undefined) {
            try {
                const portfolioContent = fs.readFileSync(this.portfolioDataPath, 'utf8');
                this.portfolio  = JSON.parse(portfolioContent);
            } catch (error) {
                throw new Error(`Error while initializing portfolio: ${error}`);
            }
            if(this.portfolio === undefined) {
                throw new Error(`Error while initializing portfolio`);
            }
        }
        return this.portfolio;
    }
}