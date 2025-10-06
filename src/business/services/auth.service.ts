import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../data/repositories/user.repository.js";
import type { UserRole } from "../entities/User.js";

export class AuthService {
  constructor(private users: UserRepository) {}

  async register(input: { email: string; password: string; role?: UserRole }) {
    const email = input.email?.trim().toLowerCase();
    const password = input.password;
    const role = input.role ?? "PUBLIC";
    if (!email || !password) throw new Error("invalid credentials");
    const existing = await this.users.findByEmail(email);
    if (existing) throw new Error("email already used");
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.create({ email, passwordHash, role } as any);
    return { id: (user as any).id, email, role };
  }

  async login(input: { email: string; password: string }) {
    const email = input.email?.trim().toLowerCase();
    const password = input.password;
    if (!email || !password) throw new Error("invalid credentials");
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error("invalid credentials");
    const ok = await bcrypt.compare(password, (user as any).passwordHash);
    if (!ok) throw new Error("invalid credentials");
    const token = jwt.sign(
      { sub: (user as any).id, role: (user as any).role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );
    return { token };
  }
}
