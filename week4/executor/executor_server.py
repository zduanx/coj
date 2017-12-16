from flask import Flask
from flask import jsonify
from flask import request
import json
app = Flask(__name__)

@app.route('/')
def hello():
    return 'hello world'

@app.route('/buildresults', methods=['POST'])
def build_and_run():
    data  = request.get_json()
    if 'code' not in data or 'lang' not in data:
        return 'You should provide "code" and "lang"'
    
    code = data['code']
    lang = data['lang']
    print("API got called with code %s in %s" %(code, lang))

    return jsonify({'build': "asdf", 'run': "asdfasdfasdfasdf"})

if __name__ == '__main__':
    app.run(debug=True)