import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MeResponse {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: true })
  gender: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
