import { Table } from "@radix-ui/themes";
import {
  Button,
  Modal,
  Flex,
  TextInput,
  MultiSelect,
  NativeSelect,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";
import { DateInput } from "@mantine/dates";
import { Link } from "react-router-dom";

const PlayerRow = ({
  player,
  playersData,
  setPlayersData,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchPlayersData,
  games,
  monitors,
  mice,
  keyboards,
  headsets,
  mousepads,
  earphones,
  teams,
  countries,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [opened, { open, close }] = useDisclosure(false);

  const handleDeletePlayer = async (player_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this player?",
    );
    if (confirmed) {
      try {
        const { data, error } = await supabase
          .from("players")
          .delete()
          .eq("player_id", player_id)
          .select();
        if (error) {
          console.error("Error deleting player:", error.message);
        } else {
          fetchPlayersData();
          console.log("Player deleted successfully:", data);
        }
      } catch (error) {
        console.error("Error deleting player:", error.message);
      }
    }
  };

  const handleUpdatePlayer = async (e) => {
    const {
      player_id,
      name,
      image_url,
      game_id,
      monitor_id,
      mouse_id,
      keyboard_id,
      headset_id,
      mousepad_id,
      earphone_id,
      team_id,
      country_id,
      birthday,
    } = e;
    const { data, error } = await supabase
      .from("players")
      .update({
        name: name,
        image_url: image_url,
        birthday: birthday,
        team: team_id,
        country: country_id,
        monitor: monitor_id,
        mouse: mouse_id,
        keyboard: keyboard_id,
        headset: headset_id,
        mousepad: mousepad_id,
        earphone: earphone_id,
      })
      .eq("player_id", player_id);
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Player edited successfully!");
    fetchPlayersData();
    console.log("EVENTO", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Row align={"center"}>
        <Table.RowHeaderCell>
          <Link
            to={`/player/${player.player_id}`}
            className=" font-medium hover:underline "
          >
            {player.name}
          </Link>
        </Table.RowHeaderCell>
        <Table.Cell>
          <img
            src={player.image_url}
            className="h-16 w-16 rounded-full border-2 border-zinc-300"
          />
        </Table.Cell>
        <Table.Cell>
          <Button variant="outline" onClick={open}>
            Edit
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDeletePlayer(player.player_id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>

      <Modal opened={opened} onClose={close} title="Edit Player" centered>
        <form onSubmit={handleSubmit(handleUpdatePlayer)}>
          <TextInput
            label="ID"
            defaultValue={player.player_id}
            readOnly
            mt="sm"
            {...register("player_id", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {/* <MultiSelect
            data={games}
            label="Game"
            placeholder="Select game"
            mt="sm"
            searchable
            {...register("game_id")}
            onChange={(i) => {
              setValue("game_id", i);
            }}
          /> */}
          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
            defaultValue={player.name}
            {...register("name", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}

          <TextInput
            label="Full Name"
            placeholder="Full Name"
            mt="sm"
            defaultValue={player.fullname}
            {...register("fullname", {
              required: {
                value: true,
                message: "Preencha o campo de nome completo",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.fullname && (
            <p className="text-sm text-red-600">{errors.fullname.message}</p>
          )}

          <DateInput
            mt="sm"
            label="Birthday"
            placeholder="YYYY/MM/DD"
            defaultValue={new Date(player.birthday)}
            {...register("birthday")}
            onChange={(i) => {
              setValue("birthday", i);
              console.log("birthday", i);
            }}
          />
          {errors.birthday && (
            <p className="text-sm text-red-600">{errors.birthday.message}</p>
          )}

          <TextInput
            label="Image"
            placeholder="Image URL"
            mt="sm"
            defaultValue={player.image_url}
            {...register("image_url", {
              required: {
                value: true,
                message: "Preencha o campo de imagem",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.image_url && (
            <p className="text-sm text-red-600">{errors.image_url.message}</p>
          )}

          <NativeSelect
            label="Team"
            mt="sm"
            data={teams}
            defaultValue={player.team}
            {...register("team_id")}
          />

          <NativeSelect
            label="Countries"
            mt="sm"
            data={countries}
            defaultValue={player.country}
            {...register("country_id")}
          />

          <NativeSelect
            label="Monitor"
            mt="sm"
            data={monitors}
            defaultValue={player.monitor}
            {...register("monitor_id")}
          />

          <NativeSelect
            label="Mouse"
            mt="sm"
            data={mice}
            defaultValue={player.mouse}
            {...register("mouse_id")}
          />

          <NativeSelect
            label="Keyboard"
            mt="sm"
            data={keyboards}
            defaultValue={player.keyboard}
            {...register("keyboard_id")}
          />

          <NativeSelect
            label="Headset"
            mt="sm"
            data={headsets}
            defaultValue={player.headset}
            {...register("headset_id")}
          />

          <NativeSelect
            label="Mousepad"
            mt="sm"
            data={mousepads}
            defaultValue={player.mousepad}
            {...register("mousepad_id")}
          />

          <NativeSelect
            label="Earphone"
            mt="sm"
            data={earphones}
            defaultValue={player.earphone}
            {...register("earphone_id")}
          />

          <Flex justify="center" align="center">
            <Button fullWidth type="submit" mt="sm">
              Edit player
            </Button>
          </Flex>
          <Flex>
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default PlayerRow;
