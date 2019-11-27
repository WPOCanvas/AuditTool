import React from "react";
import { Button } from "react-bootstrap";
import { MinMinSpinner } from "../../../../utility/Spinner";

const  Question = (props) => {
    return (
      <div>
      {console.log(props.spinner.spin , props.spinner.key.find(i => i === props.i) , props.spinner.key  , props.i)}
          {props.spinner.spin && (props.spinner.key.find(i => i === props.i) === undefined ? false : true) ? <MinMinSpinner /> : <div className="row">
            <div style={{ padding: "3px" }}>
              <Button
                onClick={props.updateItem}
                value={props.i}
                name="High"
                variant={props.updateButtons(props.i, "High")}
                size="sm"
                style={{ width: "120px" }}
              >
                Comply
              </Button>
            </div>
            <div style={{ padding: "3px" }}>
              <Button
                onClick={props.updateItem}
                value={props.i}
                name="Medium"
                variant={props.updateButtons(props.i, "Medium")}
                size="sm"
                style={{ width: "120px" }}
              >
                Partially Comply
              </Button>
            </div>

            <div style={{ padding: "3px" }}>
              <Button
                onClick={props.updateItem}
                value={props.i}
                name="Low"
                variant={props.updateButtons(props.i, "Low")}
                size="sm"
                style={{ width: "120px" }}
              >
                Not Comply
              </Button>
            </div>
          </div>}
      </div>
    );
}

export default Question;
