import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AppError, ErrorType } from '~/types/dto'
import { statProvider } from '~/util/statProvider'

export const getArts = async (
  axios: NuxtAxiosInstance,
  address: string
): Promise<any> => {
  try {
    const config = {
      params: {
        owner: address,
        order_direction: 'desc',
        offset: 0,
        limit: 20,
      },
    }
    const { data } = await axios.get(
      `${statProvider.openSeaApiEndpoint()}/assets`,
      config
    )
    return data
  } catch (e) {
    throw new AppError(e.message, ErrorType.GENERAL)
  }
}
