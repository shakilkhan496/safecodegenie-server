const Users = require('./usersModel')


module.exports = {
  createUser: async (obj) => {
    try {
      let user = new Users(obj)
      let data = await user.save()
      return data
    } catch (error) {
      throw error
    }

  },
  updateUser: async (_id, obj) => {
    try {
      let data = await Users.findOneAndUpdate({ _id }, obj, { new: true })
      return data
    } catch (error) {
      throw error
    }

  },

  getUsers: async () => {
    let data = await Users.find({}, { password: 0 })
    return data
  },

  getUserByEmail: async (email) => {
    let data = await Users.findOne({ email })
    return data
  },

  getUserById: async (_id) => {
    let data = await Users.findOne({ _id })
    return data
  },

  deleteUserById: async (_id) => {
    const deletedUser = await Users.findOneAndRemove({ _id: _id });
    return deletedUser
  },
}