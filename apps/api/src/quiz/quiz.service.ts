import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {QuizCreateDto, QuizQuestionDto, QuizUpdateDto, QuizUpdateQuestionDto} from "./dto/quiz.dto";
import {PrismaService} from "../prisma/prisma.service";
import {Question, Quiz} from "../generated/prisma/client";

@Injectable()
export class QuizService {

  constructor(private prisma: PrismaService) {
  }

  async create(userId:string, dto: QuizCreateDto): Promise<Quiz> {
    return this.prisma.quiz.create({
      data: {
        authorId: userId,
        ...dto
      }
    });
  }

  async findAll(userId:string): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: {
        OR: [
          { isPublished: true },
          { authorId: userId },
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async findOne(userId:string, quizId:string): Promise<Quiz> {
    const quiz = await this.getQuiz(quizId);
    if (!quiz) throw new NotFoundException('Квиз не найден');
    if (!quiz.isPublished && quiz.authorId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этому квизу');
    }
    return quiz;
  }

  async update(userId:string, quizId:string, dto: QuizUpdateDto): Promise<Quiz> {
    await this.checkQuizOwnership(userId, quizId);
    return this.updateQuiz(quizId, dto);
  }

  async delete(userId:string, quizId:string): Promise<Quiz> {
    await this.checkQuizOwnership(userId, quizId);
    return this.deleteQuiz(quizId)
  }

  async addQuestion(userId:string, quizId:string, dto: QuizQuestionDto): Promise<Question> {
    await this.checkQuizOwnership(userId, quizId);
    const { options, ...questionData } = dto;
    return this.prisma.question.create({
      data: {
        ...questionData,
        quizId,
        options: {
          create: options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order,
            mediaUrl: opt.mediaUrl
          }))
        }
      },
      include: {
        options: true
      }
    })
  }

  async deleteQuestion(userId:string, quizId:string, questionId:string): Promise<Question> {
    await this.checkQuizOwnership(userId, quizId);
    await this.getQuizQuestion(questionId, quizId);
    return this.prisma.question.delete({
      where: {
        id: questionId
      }
    })
  }

  async updateQuestion(userId:string, quizId:string, questionId:string, dto: QuizUpdateQuestionDto): Promise<Question> {
    await this.checkQuizOwnership(userId, quizId);
    await this.getQuizQuestion(questionId, quizId);
    const { options, ...questionData } = dto;
    return this.prisma.question.update({
      where: {
        id: questionId
      },
      data: {
        ...questionData,
        quizId,
        options: options ? {
          deleteMany: {},
          create: options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order,
            mediaUrl: opt.mediaUrl
          }))
        } : undefined
      },
      include: {
        options: true
      }
    })
  }

  private async checkQuizOwnership(userId:string, quizId:string):Promise<Quiz | NotFoundException | ForbiddenException> {
    const quiz = await this.getQuiz(quizId);

    if (!quiz) {
      throw new NotFoundException(`Квиз не найден`)
    }

    if (quiz.authorId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этому квизу')
    }

    return quiz
  }

  private async getQuiz(quizId:string):Promise<Quiz | null> {
    return this.prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: {
          include: {
            options: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
  }

  private async updateQuiz(quizId:string, dto: QuizUpdateDto):Promise<Quiz> {
    return this.prisma.quiz.update({
      where: {
        id: quizId
      },
      data: dto
    })
  }

  private async deleteQuiz(quizId:string):Promise<Quiz> {
    return this.prisma.quiz.delete({
      where: {
        id: quizId
      }
    })
  }

  private async getQuizQuestion(questionId:string, quizId:string):Promise<Question | NotFoundException> {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      }
    })

    if (!question || question.quizId !== quizId) {
      throw new NotFoundException('Вопрос не найден в данном квизе')
    }

    return question;
  }
}
