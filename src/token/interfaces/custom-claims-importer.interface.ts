import { CustomClaim } from "../concrete/custom-claim.type";
import { User } from "../../models/user.entity";

export interface ICustomClaimsImporter {
  getCustomClaimsAsync(user: User): Promise<CustomClaim[]>;
}
