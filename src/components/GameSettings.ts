
export interface FieldSettings {
    height: number,
    width: number,
}

export const EXTRA_SMALL_FIELD = 10
export const SMALL_FIELD = 15
export const MEDIUM_FIELD = 20
export const LARGE_FIELD = 25

export const CELL_LENGTH = 16

export default class GameSettings {
    fieldSize = SMALL_FIELD
    cellLength = CELL_LENGTH
    borderThickness = 3

    getFieldLength() {
        return this.fieldSize * (this.cellLength + this.borderThickness) + this.borderThickness
    }

}
