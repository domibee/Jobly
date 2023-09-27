
const { sqlForPartialUpdate } = require("./sql");



/*************************Update SQL */

describe("sqlForPartialUpdate", function(){
    test("works with one item", async function(){
        const result = sqlForPartialUpdate(
            {fN: "change"},
            {fN: "fN", fN2: "f2" });
        expect(result).toEqual({
            setCols:"\"fN\"=$1",
            values: ["change"],
        });
    });
    test("works with two items", async function(){
        const result = sqlForPartialUpdate(
            {fN: "changed", FN2: "another change"},
            {FN2: "og"});
        expect(result).toEqual({
            setCols:"\"fN\"=$1, \"og\"=$2",
            values: ["changed", "another change"]
        });
    });
    test("users original col name info mapping provided", async function(){
        const result = sqlForPartialUpdate(
            {fN:"name", fN2:31},
            {});
        expect(result.setCols).toEqual('"fN"=$1, "fN2"=$2');
        expect(result.values).toEqual(["name", 31]);
    });
})