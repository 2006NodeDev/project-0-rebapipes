import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

// update below code
export function ReimbursementDTOtoReimbursementConvertor( bto:ReimbursementDTO):Reimbursement{
    let genre:Genre[] = [];
    for(const g of bto.genres){
        genre.push({genreId:0, genre:g})
    }
    return {
        ISBN: bto.ISBN.toString(),
        authors:bto.authors,
        genre,
        bookId:bto.book_id,
        chapters:bto.chapters,
        pages:bto.pages,
        numberInSeries:bto.number_in_series,
        publisher:bto.publisher,
        publishingDate: bto.publishing_date.getFullYear(),
        series:bto.series,
        title:bto.title
    }
}
