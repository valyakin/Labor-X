import validator from 'models/validator.lang'
import components from './components'
import terms from './terms'
import layouts from './layouts'
import nav from './nav'
import tip from './tip'

export default {
  en: {
    validator,
    terms,
    nav,
    tip,
    ...layouts,
    ...components,
  },
}
