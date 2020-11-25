// import * as bcrypt from 'bcryptjs';
// import * as mongoose from 'mongoose';
// import { User, UserSchema } from './schemas/user.schema';

// export const UserSchemaProvider = {
//   name: 'User',
//   useFactory: (): mongoose.Model<User> => {

//     UserSchema.pre<User>('save', async function (next) { // <-- change to a function instead
//       const user = this;
//       console.log(user);
//       if (user.password) {
//         user.password = bcrypt.hashSync(user.password);
//       }
//     });

//     return UserSchema;
//   },
// };