class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                },
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() { //filter is used to filter the data based on the query string
        const queryCopy = { ...this.queryStr };

        //Remove fields that are not part of the filter 
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        //Filter for price and rating 
        let queryStr = JSON.stringify(queryCopy); //convert the query object to json string
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); //replace the gt, gte, lt, lte with $gt, $gte, $lt, $lte

        this.query = this.query.find(JSON.parse(queryStr)); //convert the json string back to object
        return this;
    }
    //Pagination- limit and page
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1; //if page is not provided then default to 1

        const skip = resultPerPage * (currentPage - 1); //skip is used to skip the number of records based on the page number

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;