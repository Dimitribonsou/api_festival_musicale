import { UserModel } from "../models/user.model.js";

export class UserRepository {
  findByEmail(email: string) {
    return UserModel.findOne({ where: { email } });
  }
  findById(id: number) {
    return UserModel.findByPk(id);
  }
  create(data: Partial<UserModel>) {
    return UserModel.create(data as any);
  }
}
