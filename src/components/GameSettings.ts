
export interface FieldSettings {
    height: number,
    width: number,
}

export const SMALL_FIELD = 10
export const MEDIUM_FIELD = 15
export const LARGE_FIELD = 20

export const CELL_LENGTH = 32

export default class GameSettings {
    fieldSize = SMALL_FIELD
    cellLength = CELL_LENGTH
    borderThickness = 3

    getFieldLength() {
        return this.fieldSize * (this.cellLength + this.borderThickness) + this.borderThickness
    }

}
