import {Controller, Post, UseGuards} from '@nestjs/common';
import {QuizService} from "./quiz.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {CurrentUser} from "../common/decorators/current-user.decorator";

@Controller('quizzes')
export class QuizController {

  constructor(private readonly quizService: QuizService) {
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: {id:string}) {

  }
}
