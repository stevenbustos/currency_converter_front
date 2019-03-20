<template>
  <div class="container">
    <form>
      <div class="form-group">
        <label for="youSend">You send</label>
        <div class="row">
          <div class="col-4">
            <multiselect
              v-model="fromCurrency"
              track-by="code"
              label="code"
              placeholder="Select one"
              :options="rates"
              :searchable="true"
              :allow-empty="false"
            ></multiselect>
            {{flags}}
          </div>
          <div class="col">
            <input
              v-model="valueIn"
              type="number"
              class="form-control"
              id="youSend"
              aria-describedby="money"
              placeholder="Enter amount"
            >
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="receive">Receive</label>
        <div class="row">
          <div class="col-4">
            <multiselect
              v-model="toCurrency"
              track-by="code"
              label="code"
              placeholder="Select one"
              :options="rates"
              :searchable="true"
              :allow-empty="false"
            ></multiselect>
          </div>
          <div class="col">
            <input
              v-model="valueOut"
              type="number"
              class="form-control"
              id="receive"
              aria-describedby="money"
              placeholder="Result"
              disabled
            >
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

var API_IP = process.env.VUE_APP_API_IP;

export default {
  data() {
    return {
			rates: [],
			flags: [],
      fromCurrency: "",
      toCurrency: "",
      valueIn: 0,
      valueOut: 0
    };
  },
  watch: {
    fromCurrency: function() {
      this.getRate();
    },
    toCurrency: function() {
      this.getRate();
    },
    valueIn: function() {
      this.getRate();
		},
		rates: function() {
			this.getAllFlags();
		}
  },
  mounted() {
		this.getRatesDb();
  },
  methods: {
    // Get all the rates from the DB
    getRatesDb: function() {
      axios
        .get(API_IP + "/rates")
        .then(response => {
          for (var i in response.data) {
            for (var j in response.data[i].rates) {
              var rate = {};
              rate["code"] = j;
              rate["rate"] = response.data[i].rates[j];
              this.rates.push(rate);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // Get the Flags from an API
    getAllFlags: function() {
      for (var i in this.rates) {
				var code = this.rates[i].code;
				
        axios
          .get("https://restcountries.eu/rest/v2/all")
          .then(response => {
						for(var j in response.data){
							console.log(response.data[j].flag);
							
							// for(var k in response.data[i]){
							// 	console.log(k);
							// }
						}
						console.log(response.data);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // Call the API to do the conversion
    getRate: async function() {
      // Validates that the values are not empty
      if (
        this.fromCurrency !== "" &&
        this.fromCurrency !== null &&
        this.fromCurrency !== undefined &&
        this.toCurrency !== "" &&
        this.toCurrency !== null &&
        this.toCurrency !== undefined &&
        this.valueIn !== "" &&
        this.valueIn !== null &&
        this.valueIn !== undefined
      ) {
        axios
          .get(API_IP + "/convert", {
            params: {
              from_currency: this.fromCurrency["code"],
              to_currency: this.toCurrency["code"],
              money_amount: this.valueIn
            }
          })
          .then(response => {
            console.log(response.data.msg);
            console.log(response.data.data.result);
            this.valueOut = response.data.data.result;
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
