import { ContractDAOModel } from 'src/models'
import {
  CONTRACTS_MANAGER,
  MULTI_EVENTS_HISTORY,
  ERC20_LIBRARY,
  JOB_CONTROLLER,
  BOARD_CONTROLLER,
  JOBS_DATA_PROVIDER,
  IPFS_LIBRARY,
  USER_LIBRARY,
} from 'src/daos'

export const DAOS_REGISTER = 'daos/register'
export const DAOS_INITIALIZED = 'daos/initialized'

export const initDAOs = ({ web3 }) => async (dispatch) => {
  const contractManagerDAO = CONTRACTS_MANAGER.create()
  await contractManagerDAO.connect(web3)

  dispatch({
    type: DAOS_REGISTER,
    model: new ContractDAOModel({
      contract: CONTRACTS_MANAGER,
      address: contractManagerDAO.address,
      dao: contractManagerDAO,
    }),
  })

  const history = await contractManagerDAO.getContractAddressByType(MULTI_EVENTS_HISTORY.type)

  const contracts = [
    ERC20_LIBRARY,
    JOB_CONTROLLER,
    BOARD_CONTROLLER,
    JOBS_DATA_PROVIDER,
    IPFS_LIBRARY,
    USER_LIBRARY,
  ]

  const models = await Promise.all(
    contracts.map(
      async contract => {
        const address = await contractManagerDAO.getContractAddressByType(contract.type)
        const dao = contract.create(address, history)
        dao.connect(web3)
        return new ContractDAOModel({
          contract,
          address,
          history,
          dao,
        })
      }
    )
  )

  for (const model of models) {
    dispatch({
      type: DAOS_REGISTER,
      model,
    })
  }

  dispatch({
    type: DAOS_INITIALIZED,
    isInitialized: true,
  })
}
