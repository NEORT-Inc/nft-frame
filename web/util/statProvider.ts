export const statProvider = {
  isPrd: (): boolean => {
    return process.env.PROJECT_ENV === 'production'
  },
  networkId: (): number => {
    return parseInt(process.env.NETWORK_ID || '1')
  },
  openSeaApiEndpoint: (): string => {
    return process.env.OPENSEA_API_ENDPOINT as string
  },
}
