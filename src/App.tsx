import React from 'react';
import './App.css';

import { Alert, Card, CardTitle, CardBody } from '@patternfly/react-core';

interface AppProp {}

interface AppState {
  hostname?: string;
}


export default class App extends React.Component<AppProp, AppState> {
  constructor(prop: AppProp) {
    super(prop);

    this.state = {};
  }
  mounted() {
    cockpit.file('/etc/hostname').watch((content: string) => {
      this.setState({ hostname: content.trim() });
  });
  }
  render() {
    let _ = cockpit.gettext;
    return (
      <Card>
          <CardTitle>Starter Kit</CardTitle>
          <CardBody>
              <Alert
                  variant="info"
                  title={ cockpit.format(_("Running on $0"), this.state.hostname) }
              />
          </CardBody>
      </Card>
    )
  }
}

