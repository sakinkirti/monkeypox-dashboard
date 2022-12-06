from flask import Flask
from flask import request
from DatabaseUpdater import DatabaseUpdater as DU
app = Flask(__name__)


@app.route('/api/cases')
def db_retrieve_all_cumulative_state_cases():
    """
    method to retrieve cumulative cases per day for all states in database
    """

    du = DU()
    conn = du.db_connect()
    cursor = conn.cursor()
    result = []
    states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
              "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
              "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
              "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
    for state in states:
        cursor.execute(
            f"""
                SELECT
                    json_build_object(
                        'name', state_name,
                        'cases', json_agg(
                            json_build_object(
                                'date', confirmed_date,
                                'num_cases', num_cases
                            )
                        )
                    )
                FROM (SELECT *
                    FROM case_counts
                    WHERE state_name='{state}'
                    ORDER BY confirmed_date) as sub_table
                WHERE state_name='{state}'
                GROUP BY state_name
            """
        )
        result.append(cursor.fetchall()[0][0])
    conn.close()
    newResult = []
    for index, state in enumerate(result):
        temp = []
        for index2, row in enumerate(state["cases"]):
            if index2 == 0:
                temp.append(
                    {"date": row["date"], "num_cases": row["num_cases"]})
            else:
                temp.append(
                    {"date": row["date"], "num_cases": row["num_cases"]+temp[index2-1]["num_cases"]})
        newResult.append({"state": state["name"], "cases": temp})
    return newResult

@app.route('/api/cases/total')
def db_retrieve_per_day_state_cases():
    """
    method to retrieve cases per day for all states in database
    """

    du = DU()
    conn = du.db_connect()
    cursor = conn.cursor()
    result = []
    states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
              "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
              "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
              "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
    for state in states:
        cursor.execute(
            f"""
                SELECT
                    json_build_object(
                        'name', state_name,
                        'cumulative_cases', sum(num_cases)
                    )
                FROM case_counts
                WHERE state_name='{state}'
                GROUP BY state_name
            """
        )
        result.append(cursor.fetchall()[0][0])
    conn.close()
    return result


@app.route('/api/cases/state')
def db_retrieve_state_cases():
    """
    method to retrieve case counts for specific state in database
    """
    state = request.args.get('name')
    dataType = request.args.get('dataType')
    print("Requested state: " + request.args.get('name'))
    print("Requested chart type: " + request.args.get('dataType'))
    du = DU()
    conn = du.db_connect()
    cursor = conn.cursor()
    cursor.execute(
        f"""
            SELECT
                json_agg(
                    json_build_object(
                        'date', confirmed_date,
                        'num_cases', num_cases
                    )
                ) as cases
            FROM (SELECT *
                    FROM case_counts
                    WHERE state_name='{state}'
                    ORDER BY confirmed_date) as sub_table
        """
    )
    result = cursor.fetchall()[0][0]
    newResult = []
    if dataType == "Cumulative":
        for index, state in enumerate(result):
            if index == 0:
                newResult.append({"date": state["date"], "num_cases": state["num_cases"]})
            else:
                newResult.append({"date": state["date"], "num_cases": state["num_cases"]+newResult[index-1]["num_cases"]})
    else:
        for index, state in enumerate(result):
            if index < 5:
                continue
            else:
                cases = result[index-6:index+1]
                casesSum = sum(day["num_cases"] for day in cases)
                newResult.append({"date": state["date"], "num_cases": float(f'{casesSum/7:.2f}')})
    conn.close()
    return newResult


@app.route('/api/cases/USTotal')
def db_retrieve_US_total_cases():
    """
    method to retrieve cumulative US cases in database
    """

    du = DU()
    conn = du.db_connect()
    cursor = conn.cursor()
    cursor.execute("SELECT sum(num_cases) as total_cases FROM case_counts")
    result = []
    result.append(cursor.fetchall()[0][0])
    conn.close()
    return result


@app.route('/api/cases/USTotalPerDay')
def db_retrieve_US_total_cases_per_day():
    """
    method to retrieve cumulative US cases per day in database
    """

    dataType = request.args.get('dataType')
    print("Getting chart data for United States...")
    print("Requested chart type: " + request.args.get('dataType'))
    du = DU()
    conn = du.db_connect()
    cursor = conn.cursor()
    cursor.execute("""SELECT DISTINCT confirmed_date
                        FROM case_counts
                        ORDER BY confirmed_date""")
    dates = cursor.fetchall()
    result = []
    for date in dates:
        raw = str(date) # raw ex. ('2022-11-19',)
        formatted = raw[2:12] # filter to just get 2022-11-19
        cursor.execute(f"""SELECT sum(total.num_cases) as total
                            FROM (SELECT max(num_cases) as num_cases
                                    FROM case_counts
                                    WHERE confirmed_date='{formatted}'
                                    GROUP BY confirmed_date, state_name, is_predicted) as total""")
        num_cases = cursor.fetchall()[0][0]
        result.append(({"date": formatted, "num_cases": num_cases}))
    conn.close()
    newResult = []
    if dataType == "Cumulative":
        for index, date in enumerate(result):
                if index == 0:
                    newResult.append({"date": date["date"], "num_cases": date["num_cases"]})
                else:
                    newResult.append({"date": date["date"], "num_cases": date["num_cases"]+newResult[index-1]["num_cases"]})
    else:
        for index, date in enumerate(result):
            if index < 5:
                continue
            else:
                cases = result[index-6:index+1]
                casesSum = sum(day["num_cases"] for day in cases)
                newResult.append({"date": date["date"], "num_cases": float(f'{casesSum/7:.2f}')})
    return newResult


@app.route('/api/prediction/phs')
def db_retrieve_ph_stats():
    """
    method to retrieve US current and predictive public health stats from database
    """
    du = DU()
    conn = du.db_connect()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ph_stats")
    result = cursor.fetchall()
    conn.close()
    return result


if __name__ == '__main__':
    app.run(debug=True)
