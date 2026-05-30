import firebot, { EffectType } from "@crowbartools/firebot-types";

type EffectModel = {
  message: string;
};

const exampleEffect: EffectType<EffectModel> = {
  definition: {
    id: "starter-plugin:example-effect",
    name: "Example Effect",
    description: "A simple example effect that prints a message to the logs",
    icon: "fad fa-flask",
    categories: ["scripting"],
  },
  optionsTemplate: `
    <eos-container header="Message">
      <firebot-input
        model="effect.message"
        placeholder-text="Enter message to log"
      />
    </eos-container>
  `,
  optionsController: ($scope) => {
    if ($scope.effect.message == null) {
      $scope.effect.message = "Hello from the example effect!";
    }
  },
  optionsValidator: (effect) => {
    const errors: string[] = [];
    if (!effect.message) {
      errors.push("Please enter a message to log.");
    }
    return errors;
  },
  onTriggerEvent: async (event) => {
    const { message } = event.effect;
    firebot.logger.info(`[Example Effect] ${message}`);
    return true;
  },
};

export default exampleEffect;

