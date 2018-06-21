import { createSelector } from 'reselect'
import uniqid from 'uniqid'
import { ProfileModel, ProfileIPFSModel } from 'src/models'

export const profileSelector = (address) => createSelector(
  (/*state*/) => {
    return new ProfileModel({
      id: uniqid(),
      address,
      ipfs: new ProfileIPFSModel({}),
    })
  }
)
