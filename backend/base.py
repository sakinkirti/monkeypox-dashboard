from flask import Flask
from DatabaseUpdater import DatabaseUpdater as DU
app = Flask(__name__)


@app.route('/api/cases')
def db_retrieve_state_cases():
    """
    method to retrieve data for specific state in database
    """

    du = DU()
    conn = du.db_connect()
    cursor = conn.cursor()
    result = []
    states=["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
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
                        ),
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


if __name__ == '__main__':
    app.run(debug=True)
