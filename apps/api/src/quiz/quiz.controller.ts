import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {QuizService} from "./quiz.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {CurrentUser} from "../common/decorators/current-user.decorator";
import {
  createQuestionSchema,
  createQuizSchema,
  QuizCreateDto,
  QuizQuestionDto,
  QuizUpdateDto, QuizUpdateQuestionDto, updateQuestionSchema,
  updateQuizSchema
} from "./dto/quiz.dto";
import {Question, Quiz} from "../generated/prisma/client";
import {ZodValidationPipe} from "../pipes/zod-validation-pipe";

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizController {

  constructor(private readonly quizService: QuizService) {
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createQuizSchema))
  async create(@CurrentUser() user: {id:string},
               @Body() dto: QuizCreateDto): Promise<Quiz> {
    return this.quizService.create(user.id, dto)
  }

  @Get()
  async findAll(@CurrentUser() user: {id: string}): Promise<Quiz[]> {
    return this.quizService.findAll(user.id)
  }

  @Get(':id')
  async findOne(@CurrentUser() user: {id: string},
                @Param('id') quizId: string): Promise<Quiz> {
    return this.quizService.findOne(user.id, quizId)
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateQuizSchema))
  async update(@CurrentUser() user: {id: string}, @Param('id') quizId: string, @Body() dto: QuizUpdateDto): Promise<Quiz> {
    return this.quizService.update(user.id, quizId, dto)
  }

  @Delete(':id')
  async delete(@CurrentUser() user: {id: string}, @Param('id') quizId: string): Promise<Quiz> {
    return this.quizService.delete(user.id, quizId)
  }

  @Post(':id/questions')
  @UsePipes(new ZodValidationPipe(createQuestionSchema))
  async createQuestion(@CurrentUser() user: {id: string},
                       @Param('id') quizId: string,
                       @Body() dto: QuizQuestionDto):Promise<Question> {
    return this.quizService.addQuestion(user.id, quizId, dto)
  }

  @Patch(':id/questions/:questionId')
  @UsePipes(new ZodValidationPipe(updateQuestionSchema))
  async updateQuestion(@CurrentUser() user: {id: string},
                       @Param('id') quizId: string,
                       @Param('questionId') questionId: string,
                       @Body() dto: QuizUpdateQuestionDto):Promise<Question> {
    return this.quizService.updateQuestion(user.id, quizId, questionId, dto)
  }

  @Delete(':id/questions/:questionId')
  async deleteQuestion(@CurrentUser() user: {id: string},
                       @Param('id') quizId: string,
                       @Param('questionId') questionId: string):Promise<Question> {
    return this.quizService.deleteQuestion(user.id, quizId, questionId)
  }
}
