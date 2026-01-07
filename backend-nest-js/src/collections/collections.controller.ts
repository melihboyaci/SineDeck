import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AddItemsDto } from './dto/add-items.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Collections')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni koleksiyon oluştur' })
  create(@Request() req, @Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Kullanıcının koleksiyonlarını listele' })
  findAll(@Request() req) {
    return this.collectionsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Koleksiyon detayını getir' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.collectionsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Koleksiyonu güncelle' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Koleksiyonu sil' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.collectionsService.remove(id, req.user.userId);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Koleksiyona film/dizi ekle' })
  addItems(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: AddItemsDto,
  ) {
    return this.collectionsService.addItems(id, req.user.userId, dto);
  }

  @Delete(':id/items')
  @ApiOperation({ summary: 'Koleksiyondan film/dizi çıkar' })
  removeItems(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: AddItemsDto,
  ) {
    return this.collectionsService.removeItems(id, req.user.userId, dto);
  }
}
