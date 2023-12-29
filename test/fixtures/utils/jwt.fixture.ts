import { Mock } from "mockingbird";

export class JWTFixture {
  @Mock("HS256")
  algorithm: string;

  @Mock("testAudience")
  audience: string;

  @Mock("testIssuer")
  issuer: string;

  @Mock("testSecret")
  secret: string;

  @Mock(3600)
  expiresIn: number;
}
