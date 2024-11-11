export class UpdateScheduleDTO {

    private constructor(
        public readonly scheduled_movie_id: number,
        public readonly capacity: number,
        public readonly start_date: Date,
        public readonly movie_id: number,
    ) {}

    public toObject() {
        return Object.assign({}, this);
    }

    get values() {
        let returnObj: { [ key: string ]: any} = {};
        let thisObj = this.toObject();
        for( let [key, value] of Object.entries( thisObj )) {
            if (key !== 'scheduled_movie_id' && value ) returnObj[ key ] = value;
        }
        return returnObj;
    }

    static create( object: { [ key: string ]: any } ): [ string?, UpdateScheduleDTO? ] {

        const { scheduled_movie_id, capacity, start_date, movie_id } = object;

        return [ undefined, new UpdateScheduleDTO( scheduled_movie_id, capacity, start_date, movie_id ) ];
    }

}
