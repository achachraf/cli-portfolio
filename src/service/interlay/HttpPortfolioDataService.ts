import PortfolioDataService from "../application/PortfolioDataService";


export class HttpPortfolioDataService implements PortfolioDataService {

    private readonly portfolioDataUrl: string;

    private portfolio: Portfolio | undefined = undefined;

    constructor(portfolioDataUrl: string) {
        this.portfolioDataUrl = portfolioDataUrl;
    }

    async getPortfolio(): Promise<Portfolio> {
        if(this.portfolio === undefined) {
            try {
                const response = await fetch(this.portfolioDataUrl);
                this.portfolio = await response.json();
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