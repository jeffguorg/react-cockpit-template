import React from 'react';

import "@patternfly/patternfly/patternfly.css";
import { Alert, Card, CardTitle, CardBody } from '@patternfly/react-core';

interface AppProp { }

interface AppState {
  hostname?: string;
}


export default class App extends React.Component<AppProp, AppState> {
  constructor(prop: AppProp) {
    super(prop);

    this.state = {};
  }
  componentDidMount() {
    if (window.cockpit) {
      console.log(window.cockpit.file('/etc/hostname').read().then((content) => {
        this.setState({
          hostname: content.trim(),
        })
      }))
    }
  }
  render() {
    if(window.cockpit) {
      let _ = window.cockpit.gettext;
      return (
        <Card>
          <CardTitle>Starter Kit</CardTitle>
          <CardBody>
            <Alert
              variant="info"
              title={window.cockpit.format(_("Running on $0"), this.state.hostname)}
            />
          </CardBody>
        </Card>
      )
    }

    return (
      <Card>
        <CardTitle>Starter Kit</CardTitle>
        <CardBody>
          <Alert
            variant="info"
            title="Cockpit not found"
          />
        </CardBody>
      </Card>
    )
  }
}

