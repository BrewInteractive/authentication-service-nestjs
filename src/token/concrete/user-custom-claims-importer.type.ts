import { CustomClaim } from "./custom-claim.type";
import { ICustomClaimsImporter } from "../interfaces/custom-claims-importer.interface";
import { User } from "src/entities/user.entity";

export class UserCustomClaimsImporter implements ICustomClaimsImporter {
  async getCustomClaimsAsync(user: User): Promise<CustomClaim[]> {
    const customClaims: CustomClaim[] = [];

    customClaims.push(new CustomClaim("user_id", user.id));
    customClaims.push(new CustomClaim("first_name", user.firstName));
    customClaims.push(new CustomClaim("last_name", user.lastName));
    if (user.email) customClaims.push(new CustomClaim("email", user.email));
    if (user.username)
      customClaims.push(new CustomClaim("username", user.username));
    if (user?.roles?.length > 0)
      customClaims.push(
        new CustomClaim(
          "roles",
          user.roles.map((userRole) => userRole.role.name ?? userRole.role)
        )
      );

    return customClaims;
  }
}
