import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { SetSeriesGenresDto } from './dto/set-series-genres.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Series (Diziler)')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @ApiOperation({ summary: 'Yeni dizi ekle (Admin/Editor)' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post()
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @ApiOperation({ summary: 'Diziye tür ata (Admin/Editor)' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch(':id/genres')
  setGenres(
    @Param('id', ParseIntPipe) id: number,
    @Body() setSeriesGenresDto: SetSeriesGenresDto,
  ) {
    return this.seriesService.setGenres(id, setSeriesGenresDto);
  }

  @ApiOperation({ summary: 'Tüm dizileri listele' })
  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  @ApiOperation({ summary: 'Belirli bir diziyi getir' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.seriesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Dizi bilgilerini güncelle (Admin/Editor)' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    return this.seriesService.update(+id, updateSeriesDto);
  }

  @ApiOperation({ summary: 'Dizi sil (Sadece Admin)' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seriesService.remove(+id);
  }
}
