const Cooperation = require('~/models/cooperation')
const { createForbiddenError } = require('~/utils/errorsHelper')

const cooperationService = {
  getCooperations: async (pipeline) => {
    const [result] = await Cooperation.aggregate(pipeline).exec()

    return result
  },

  getCooperationById: async (id) => {
    return await Cooperation.findById(id).populate('offer', ['id', 'author', 'price']).lean().exec()
  },

  createCooperation: async (initiator, initiatorRole, data) => {
    const { offer, proficiencyLevel, additionalInfo, receiver, receiverRole, price } = data

    return await Cooperation.create({
      initiator,
      initiatorRole,
      receiver,
      receiverRole,
      offer,
      price,
      proficiencyLevel,
      additionalInfo,
      needAction: receiverRole
    })
  },

  updateCooperation: async (id, currentUser, updateData) => {
    const { role: currentUserRole } = currentUser
    const { price, status } = updateData

    const cooperation = await Cooperation.findById(id)

    if (price) {
      if (currentUserRole !== cooperation.needAction) {
        throw createForbiddenError()
      }
      cooperation.price = price
      cooperation.needAction = cooperation.needAction === 'student' ? 'tutor' : 'student'

      await cooperation.save()
    }
    if (status) {
      cooperation.status = status
      await cooperation.save()
    }
  }
}

module.exports = cooperationService
