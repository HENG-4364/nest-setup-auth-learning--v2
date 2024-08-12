import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterUser {
  @Field(() => Boolean, { nullable: true })
  isStatus: boolean;

  @Field(() => String, { nullable: true })
  fullName: string;
}
