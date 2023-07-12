import axios from 'axios'
import { ChainInfo } from '@safe-global/safe-apps-sdk'

enum PROVIDER {
  SOURCIFY = 1,
  GATEWAY = 2,
  BLOCKSCOUT = 3,
}

type SourcifyResponse = {
  name: string
  path: string
  content: string
}

const METADATA_FILE = 'metadata.json'
const DEFAULT_TIMEOUT = 10000

const getProviderURL = (chain: string, address: string, urlProvider: PROVIDER): string => {
  switch (urlProvider) {
    case PROVIDER.SOURCIFY:
      return `https://sourcify.dev/server/files/${chain}/${address}`
    case PROVIDER.GATEWAY:
      return `${getGatewayBaseUrl(chain)}/v1/chains/${chain}/contracts/${address}`
    case PROVIDER.BLOCKSCOUT:
      return `https://blockscout.com/${chain}/api?module=contract&action=getabi&address=${address}`
    default:
      throw new Error('The Provider is not supported')
  }
}

export enum SUPPORTED_CHAINS {
  ACALA = '787',
  KARURA = '686',
  MANDALA = '595',
  ASTAR = '592',
  SHIDEN = '336',
  SHIBUYA = '81',
  BOBABEAM = '1294',
  CASCADIA_TESTNET = '6102',
  CRONOS = '25',
  CRONOS_TESTNET = '338',
  EVMOS = '9001',
  EVMOS_TESTNET = '9000',
  HARMONY = '1666600000',
  HARMONY_TESTNET = '1666700000',
  IOTEX = '4689',
  IOTEX_TESTNET = '4690',
  LINEA = '59144',
  LINEA_TESTNET = '59140',
  MANTLE = '5000',
  MANTLE_TESTNET = '5001',
  MOONBEAM = '1284',
  MOONRIVER = '1285',
  MOONBASE = '1287',
  NEON_EVM = '245022934',
  NEON_EVM_DEVNET = '245022926',
  NEON_EVM_TESTNET = '245022940',
  OASIS_SAPPHIRE = '23294',
  OASIS_SAPPHIRE_TESTNET = '23295',
  RSK = '30',
  RSK_TESTNET = '31',
  TELOS = '40',
  TELOS_TESTNET = '41',
  TENET = '155',
  TENET_TESTNET = '1559',
  THUNDER_CORE = '108',
  THUNDER_CORE_TESTNET = '18',
  VELAS = '106',
  VELAS_TESTNET = '111',
  ZKSYNC_ERA = '324',
  ZKSYNC_ERA_TESTNET = '280',
}

const getGatewayBaseUrl = (chain: string) => {
  const isProdEnv = process.env?.REACT_APP_IS_PRODUCTION === 'true'

  switch (chain) {
    case SUPPORTED_CHAINS.ACALA:
    case SUPPORTED_CHAINS.KARURA:
    case SUPPORTED_CHAINS.MANDALA:
      return isProdEnv
        ? `https://gateway.safe.acala.network`
        : `https://gateway.staging.safe.acala.network`
    case SUPPORTED_CHAINS.ASTAR:
    case SUPPORTED_CHAINS.SHIDEN:
    case SUPPORTED_CHAINS.SHIBUYA:
      return isProdEnv
        ? `https://gateway.safe.astar.network`
        : `https://gateway.staging-safe.astar.network`
    case SUPPORTED_CHAINS.BOBABEAM:
      return isProdEnv
        ? `https://gateway.multisig.bobabeam.boba.network`
        : `https://gateway.staging.multisig.bobabeam.boba.network`
    case SUPPORTED_CHAINS.CASCADIA_TESTNET:
      return isProdEnv
        ? `https://gateway.safe.cascadia.foundation`
        : `https://gateway.staging.safe.cascadia.foundation`
    case SUPPORTED_CHAINS.CRONOS:
    case SUPPORTED_CHAINS.CRONOS_TESTNET:
      return isProdEnv
        ? `https://gateway.cronos-safe.org`
        : `https://gateway-cronos-safe.crolabs-int.co`
    case SUPPORTED_CHAINS.EVMOS:
    case SUPPORTED_CHAINS.EVMOS_TESTNET:
      return isProdEnv ? `https://gateway.safe.evmos.org` : `https://gateway.safe.evmos.dev`
    case SUPPORTED_CHAINS.HARMONY:
    case SUPPORTED_CHAINS.HARMONY_TESTNET:
      return isProdEnv
        ? `https://gateway.multisig.harmony.one`
        : `https://gateway.staging-safe.harmony.one`
    case SUPPORTED_CHAINS.IOTEX:
    case SUPPORTED_CHAINS.IOTEX_TESTNET:
      return isProdEnv ? `https://gateway.safe.iotex.io` : `https://gateway.staging.safe.iotex.io`
    case SUPPORTED_CHAINS.LINEA:
    case SUPPORTED_CHAINS.LINEA_TESTNET:
      return isProdEnv
        ? `https://gateway.safe.linea.build`
        : `https://gateway.staging.safe.linea.build`
    case SUPPORTED_CHAINS.MANTLE:
    case SUPPORTED_CHAINS.MANTLE_TESTNET:
      return isProdEnv
        ? `https://gateway.multisig.mantle.xyz`
        : `https://gateway.staging.multisig.mantle.xyz`
    case SUPPORTED_CHAINS.MOONBEAM:
    case SUPPORTED_CHAINS.MOONRIVER:
    case SUPPORTED_CHAINS.MOONBASE:
      return isProdEnv
        ? `https://gateway.multisig.moonbeam.network`
        : `https://gateway.staging.multisig.moonbeam.network`
    case SUPPORTED_CHAINS.NEON_EVM:
    case SUPPORTED_CHAINS.NEON_EVM_DEVNET:
    case SUPPORTED_CHAINS.NEON_EVM_TESTNET:
      return `https://gateway.neonevm.safe.protofire.io`
    case SUPPORTED_CHAINS.OASIS_SAPPHIRE:
    case SUPPORTED_CHAINS.OASIS_SAPPHIRE_TESTNET:
      return isProdEnv ? `https://gateway.safe.oasis.io` : `https://gateway.safe.stg.oasis.io`
    case SUPPORTED_CHAINS.RSK:
    case SUPPORTED_CHAINS.RSK_TESTNET:
      return isProdEnv
        ? `https://gateway.safe.rootstock.io`
        : `https://gateway.staging.safe.rootstock.io`
    case SUPPORTED_CHAINS.TELOS:
    case SUPPORTED_CHAINS.TELOS_TESTNET:
      return `https://gateway.safe.telos.net`
    case SUPPORTED_CHAINS.TENET:
    case SUPPORTED_CHAINS.TENET_TESTNET:
      return isProdEnv ? `https://gateway.safe.tenet.org` : `https://gateway.staging.safe.tenet.org`
    case SUPPORTED_CHAINS.THUNDER_CORE:
    case SUPPORTED_CHAINS.THUNDER_CORE_TESTNET:
      return isProdEnv
        ? `https://gateway.safe.thundercore.com`
        : `https://gateway.staging.safe.thundercore.com`
    case SUPPORTED_CHAINS.VELAS:
    case SUPPORTED_CHAINS.VELAS_TESTNET:
      return isProdEnv ? `https://gateway.velasafe.com` : `https://gateway.staging.velasafe.com`
    case SUPPORTED_CHAINS.ZKSYNC_ERA:
    case SUPPORTED_CHAINS.ZKSYNC_ERA_TESTNET:
      return isProdEnv
        ? `https://gateway.zksafe.protofire.io`
        : `https://gateway.staging-zksafe.protofire.io`
    default:
      throw new Error(
        `[getGatewayBaseUrl]: There is no gateway for ${chain}, therefore we cannot get the contract abi from it.`,
      )
  }
}

const getAbiFromSourcify = async (address: string, chainId: string): Promise<any> => {
  const { data } = await axios.get<SourcifyResponse[]>(
    getProviderURL(chainId, address, PROVIDER.SOURCIFY),
    {
      timeout: DEFAULT_TIMEOUT,
    },
  )

  if (data.length) {
    const metadata = data.find((item: SourcifyResponse) => item.name === METADATA_FILE)
    return metadata && JSON.parse(metadata.content)?.output?.abi
  }

  throw new Error('Contract found but could not found abi using Sourcify')
}

const getAbiFromGateway = async (address: string, chainId: string): Promise<any> => {
  const { data } = await axios.get(getProviderURL(chainId, address, PROVIDER.GATEWAY), {
    timeout: DEFAULT_TIMEOUT,
  })

  // We need to check if the abi is present in the response because it's possible
  // That the transaction service just stores the contract and returns 200 without querying for the abi
  // (or querying for the abi failed)
  if (data && data.contractAbi?.abi) {
    return data?.contractAbi?.abi
  }

  throw new Error('Contract found but could not found ABI using the Gateway')
}

const getAbiFromBlockscout = async (address: string, chainId: string): Promise<any> => {
  const { data } = await axios.get(getProviderURL(chainId, address, PROVIDER.BLOCKSCOUT), {
    timeout: DEFAULT_TIMEOUT,
  })
  // We need to check if the abi is present in the response because it's possible
  // That the transaction service just stores the contract and returns 200 without querying for the abi
  // (or querying for the abi failed)
  if (data && data.message === 'OK' && data.result) {
    return JSON.parse(data.result)
  }

  throw new Error('Contract found but could not found ABI using Blockscout')
}

const getAbi = async (address: string, chainInfo: ChainInfo): Promise<any> => {
  let abi
  try {
    abi = await Promise.any([
      getAbiFromSourcify(address, chainInfo.chainId),
      getAbiFromGateway(address, chainInfo.chainId),
      getAbiFromBlockscout(address, chainInfo.chainId),
    ])
  } catch {
    abi = null
  }
  return abi
}

export default getAbi
